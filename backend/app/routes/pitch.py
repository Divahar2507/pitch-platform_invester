from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.models.core import User, StartupProfile, Pitch
from app.schemas import PitchCreate, PitchResponse
import shutil
import os
import uuid

router = APIRouter(prefix="/pitches", tags=["Pitch"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_pitch_deck(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    if current_user.role != "startup":
        raise HTTPException(status_code=403, detail="Only startups can upload pitch decks")
    
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": file_path}

@router.post("/", response_model=PitchResponse)
def create_pitch(
    pitch: PitchCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "startup":
        raise HTTPException(status_code=403, detail="Only startups can create pitches")
    
    if not current_user.startup_profile:
        raise HTTPException(status_code=400, detail="Please create a startup profile first")
    
    new_pitch = Pitch(
        **pitch.model_dump(),
        startup_id=current_user.startup_profile.id,
        status="draft"
    )
    db.add(new_pitch)
    db.commit()
    db.refresh(new_pitch)
    return new_pitch

@router.get("/my", response_model=list[PitchResponse])
def get_my_pitches(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "startup":
        raise HTTPException(status_code=403, detail="Only startups can access this")
    
    if not current_user.startup_profile:
        return []
        
    return db.query(Pitch).filter(Pitch.startup_id == current_user.startup_profile.id).all()

@router.get("/feed", response_model=list[PitchResponse])
def get_pitch_feed(
    industry: str = None,
    stage: str = None,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "investor":
         raise HTTPException(status_code=403, detail="Only investors can access the feed")
    
    query = db.query(Pitch).join(StartupProfile).filter(Pitch.status != "draft")
    
    if industry and industry != "All":
        # Case insensitive partial match or exact match depending on requirement
        query = query.filter(StartupProfile.industry == industry)
        
    if stage and stage != "All":
        query = query.filter(StartupProfile.funding_stage == stage)
        
    results = query.all()
    
    # Enrich response
    response_list = []
    for pitch in results:
        resp = PitchResponse.model_validate(pitch)
        resp.company_name = pitch.startup.company_name
        resp.industry = pitch.startup.industry
        resp.stage = pitch.startup.funding_stage
        # Mock match score for now, real implementation would compare with investor preferences
        import random
        resp.match_score = random.randint(60, 99) 
        response_list.append(resp)
        
    return response_list
