import uuid
from typing import Optional, List, Dict, Any, Callable
from datetime import datetime, timezone

from sqlalchemy import (
    Column, Integer, String, Text, DateTime, LargeBinary, 
    UniqueConstraint, create_engine
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session

from memori.storage._base import (
    BaseStorageAdapter,
    BaseConversationMessage,
    BaseEntityFact,
    BaseKnowledgeGraph,
    BaseSession
)

Base = declarative_base()

# ==============================================================================
# SCHEMA DEFINITION
# ==============================================================================

class MemoriSessionModel(Base):
    __tablename__ = 'memori_session'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    uuid = Column(String(36), nullable=False, unique=True, default=lambda: str(uuid.uuid4()))
    entity_id = Column(Integer, nullable=True)
    process_id = Column(Integer, nullable=True)
    date_created = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    date_updated = Column(DateTime, nullable=True, onupdate=lambda: datetime.now(timezone.utc))


class MemoriConversationMessageModel(Base):
    __tablename__ = 'memori_conversation_message'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    uuid = Column(String(36), nullable=False, unique=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(Integer, nullable=False)
    role = Column(String(50), nullable=False)
    type = Column(String(50), nullable=True)
    content = Column(Text, nullable=False)
    date_created = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    date_updated = Column(DateTime, nullable=True, onupdate=lambda: datetime.now(timezone.utc))


class MemoriEntityFactModel(Base):
    __tablename__ = 'memori_entity_fact'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    uuid = Column(String(36), nullable=False, unique=True, default=lambda: str(uuid.uuid4()))
    entity_id = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    content_embedding = Column(LargeBinary, nullable=False)
    num_times = Column(Integer, nullable=False, default=1)
    date_last_time = Column(String(255), nullable=False)
    uniq = Column(String(255), nullable=False)
    date_created = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    date_updated = Column(DateTime, nullable=True, onupdate=lambda: datetime.now(timezone.utc))


class MemoriKnowledgeGraphModel(Base):
    __tablename__ = 'memori_knowledge_graph'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    uuid = Column(String(36), nullable=False, unique=True, default=lambda: str(uuid.uuid4()))
    entity_id = Column(Integer, nullable=False)
    subject_id = Column(Integer, nullable=False)
    predicate_id = Column(Integer, nullable=False)
    object_id = Column(Integer, nullable=False)
    num_times = Column(Integer, nullable=False, default=1)
    date_last_time = Column(String(255), nullable=False)
    date_created = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    date_updated = Column(DateTime, nullable=True, onupdate=lambda: datetime.now(timezone.utc))
    
    __table_args__ = (
        UniqueConstraint('entity_id', 'subject_id', 'predicate_id', 'object_id', name='uk_memori_knowledge_graph_espo'),
    )


# ==============================================================================
# ADAPTER IMPLEMENTATION
# ==============================================================================

class CustomSQLAlchemyAdapter(BaseStorageAdapter):
    """
    Core adapter that satisfies Memori's storage interface,
    wrapping a SQLAlchemy Session.
    """
    def __init__(self, conn_factory: Callable[[], Session]):
        # BaseStorageAdapter will execute conn_factory() to assign self.conn
        # and configure self._release logic for teardown
        super().__init__(conn_factory)

    def commit(self) -> 'CustomSQLAlchemyAdapter':
        self.conn.commit()
        return self

    def execute(self, operation: Any, binds: Optional[Dict[str, Any]] = None) -> Any:
        if binds is None:
            binds = {}
        return self.conn.execute(operation, binds)

    def flush(self) -> 'CustomSQLAlchemyAdapter':
        self.conn.flush()
        return self

    def get_dialect(self) -> str:
        # Infer the dialect from the bound engine
        return self.conn.get_bind().dialect.name

    def rollback(self) -> 'CustomSQLAlchemyAdapter':
        self.conn.rollback()
        return self

    @classmethod
    def build_schema(cls, engine) -> None:
        """
        Idempotent method to build schema safely.
        Base.metadata.create_all ignores existing tables.
        """
        Base.metadata.create_all(engine)


# ==============================================================================
# SUB-COMPONENT IMPLEMENTATIONS
# ==============================================================================

class CustomSessionStorage(BaseSession):
    def create(self, uuid_str: str, entity_id: int, process_id: int) -> int:
        session: Session = self.conn.conn
        new_session = MemoriSessionModel(
            uuid=uuid_str,
            entity_id=entity_id,
            process_id=process_id
        )
        session.add(new_session)
        session.flush()
        return new_session.id


class CustomConversationMessageStorage(BaseConversationMessage):
    def create(self, conversation_id: int, role: str, type: str, content: str) -> int:
        session: Session = self.conn.conn
        msg = MemoriConversationMessageModel(
            conversation_id=conversation_id,
            role=role,
            type=type,
            content=content
        )
        session.add(msg)
        session.flush()
        return msg.id


class CustomEntityFactStorage(BaseEntityFact):
    def create(
        self,
        entity_id: int,
        facts: List[str],
        fact_embeddings: Optional[List[bytes]] = None,
        conversation_id: Optional[int] = None,
    ) -> List[int]:
        session: Session = self.conn.conn
        new_facts = []
        
        for idx, fact in enumerate(facts):
            # Fallback embedding if not provided
            embedding = fact_embeddings[idx] if fact_embeddings and idx < len(fact_embeddings) else b''
            
            new_fact = MemoriEntityFactModel(
                entity_id=entity_id,
                content=fact,
                content_embedding=embedding,
                num_times=1,
                date_last_time=str(datetime.now(timezone.utc)),
                uniq=str(uuid.uuid4()) # In production, hash the content to ensure uniqueness
            )
            new_facts.append(new_fact)
            
        session.add_all(new_facts)
        session.flush()
        return [f.id for f in new_facts]

    def get_embeddings(self, entity_id: int, limit: int = 1000) -> List[bytes]:
        session: Session = self.conn.conn
        facts = session.query(MemoriEntityFactModel).filter_by(entity_id=entity_id).limit(limit).all()
        return [f.content_embedding for f in facts]

    def get_facts_by_ids(self, fact_ids: List[int]) -> List[Any]:
        session: Session = self.conn.conn
        return session.query(MemoriEntityFactModel).filter(MemoriEntityFactModel.id.in_(fact_ids)).all()

    def delete_by_entity(self, entity_id: int) -> None:
        session: Session = self.conn.conn
        session.query(MemoriEntityFactModel).filter_by(entity_id=entity_id).delete()
        session.flush()


class CustomKnowledgeGraphStorage(BaseKnowledgeGraph):
    def create(self, entity_id: int, semantic_triples: List[Dict[str, int]]) -> List[int]:
        session: Session = self.conn.conn
        new_triples = []
        for triple in semantic_triples:
            new_triple = MemoriKnowledgeGraphModel(
                entity_id=entity_id,
                subject_id=triple.get('subject_id', 0),
                predicate_id=triple.get('predicate_id', 0),
                object_id=triple.get('object_id', 0),
                num_times=1,
                date_last_time=str(datetime.now(timezone.utc))
            )
            new_triples.append(new_triple)
            
        session.add_all(new_triples)
        session.flush()
        return [t.id for t in new_triples]

    def delete_by_entity(self, entity_id: int) -> None:
        session: Session = self.conn.conn
        session.query(MemoriKnowledgeGraphModel).filter_by(entity_id=entity_id).delete()
        session.flush()


# ==============================================================================
# USAGE EXAMPLE
# ==============================================================================

if __name__ == "__main__":
    # 1. Create a SQLAlchemy engine with connection pool resilience enabled
    # pool_pre_ping=True tests connections before handing them off, ensuring
    # long-running agents don't fail due to stale DB connections.
    engine = create_engine(
        "sqlite:///memori_custom_byodb.db", 
        pool_pre_ping=True, 
        echo=False
    )
    
    # 2. Build Schema idempotently
    CustomSQLAlchemyAdapter.build_schema(engine)
    
    # 3. Create a thread-safe Session factory
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # 4. Define the callable connection factory for Memori
    def get_memori_db_session() -> Session:
        return SessionLocal()
    
    # 5. Initialize the adapter
    adapter = CustomSQLAlchemyAdapter(conn_factory=get_memori_db_session)
    
    try:
        # Example: Initialize storage modules using the adapter
        session_store = CustomSessionStorage(conn=adapter)
        message_store = CustomConversationMessageStorage(conn=adapter)
        
        # Create a new session
        new_session_id = session_store.create(
            uuid_str=str(uuid.uuid4()), 
            entity_id=1, 
            process_id=1
        )
        print(f"Created Memori Session ID: {new_session_id}")
        
        # Commit the transaction
        adapter.commit()
    except Exception as e:
        adapter.rollback()
        print(f"An error occurred: {e}")
    finally:
        # Memori BaseStorageAdapter safely closes/returns the resource
        adapter.close()
