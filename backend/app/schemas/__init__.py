from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# Auth & User
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: str = Field(..., pattern="^(startup|investor)$")

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# Startup
class StartupBase(BaseModel):
    company_name: str
    industry: str
    funding_stage: str
    vision: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None

class StartupCreate(StartupBase):
    pass

class StartupResponse(StartupBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Investor
class InvestorBase(BaseModel):
    firm_name: str
    focus_industries: Optional[str] = None
    preferred_stage: str

class InvestorCreate(InvestorBase):
    pass

class InvestorResponse(InvestorBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Pitch
class PitchBase(BaseModel):
    title: str
    description: Optional[str] = None
    pitch_file_url: Optional[str] = None
    raising_amount: Optional[str] = None
    equity_percentage: Optional[str] = None

class PitchCreate(PitchBase):
    pass

class PitchResponse(PitchBase):
    id: int
    startup_id: int
    pitch_file_url: Optional[str] = None
    status: str
    created_at: datetime
    
    # Flattened fields for easy frontend consumption
    company_name: Optional[str] = None
    industry: Optional[str] = None
    stage: Optional[str] = None
    match_score: Optional[int] = None # For displaying match %

    class Config:
        from_attributes = True

# Match
class MatchResponse(BaseModel):
    id: int
    startup_id: int
    investor_id: int
    match_score: float
    startup_name: Optional[str] = None # Added for convenience
    investor_name: Optional[str] = None # Added for convenience

    class Config:
        from_attributes = True

# Message
class MessageCreate(BaseModel):
    receiver_id: int
    content: str

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True
