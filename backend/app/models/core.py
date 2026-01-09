from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False) # 'startup' or 'investor'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    startup_profile = relationship("StartupProfile", back_populates="user", uselist=False)
    investor_profile = relationship("InvestorProfile", back_populates="user", uselist=False)
    sent_messages = relationship("Message", back_populates="sender", foreign_keys="Message.sender_id")
    received_messages = relationship("Message", back_populates="receiver", foreign_keys="Message.receiver_id")

class StartupProfile(Base):
    __tablename__ = "startup_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String, nullable=False)
    industry = Column(String, nullable=False)
    funding_stage = Column(String, nullable=False)
    vision = Column(Text)
    problem = Column(Text)
    solution = Column(Text)
    
    user = relationship("User", back_populates="startup_profile")
    pitches = relationship("Pitch", back_populates="startup")
    matches = relationship("Match", back_populates="startup")

class InvestorProfile(Base):
    __tablename__ = "investor_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    firm_name = Column(String, nullable=False)
    focus_industries = Column(String) # Comma-separated or JSON string
    preferred_stage = Column(String, nullable=False)
    
    user = relationship("User", back_populates="investor_profile")
    matches = relationship("Match", back_populates="investor")

class Pitch(Base):
    __tablename__ = "pitches"
    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startup_profiles.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    pitch_file_url = Column(String)
    status = Column(String, default="draft") # draft / shared / under_review
    raising_amount = Column(String) # e.g. "$2M"
    equity_percentage = Column(String) # e.g. "10%"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    startup = relationship("StartupProfile", back_populates="pitches")

class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startup_profiles.id"), nullable=False)
    investor_id = Column(Integer, ForeignKey("investor_profiles.id"), nullable=False)
    match_score = Column(Float)
    
    startup = relationship("StartupProfile", back_populates="matches")
    investor = relationship("InvestorProfile", back_populates="matches")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    sender = relationship("User", back_populates="sent_messages", foreign_keys=[sender_id])
    receiver = relationship("User", back_populates="received_messages", foreign_keys=[receiver_id])
