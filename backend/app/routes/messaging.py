from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.dependencies import get_db, get_current_user
from app.models.core import User, Message
from app.schemas import MessageCreate, MessageResponse

router = APIRouter(prefix="/messages", tags=["Messaging"])

@router.post("/send", response_model=MessageResponse)
def send_message(
    message: MessageCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    receiver = db.query(User).filter(User.id == message.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    new_message = Message(
        sender_id=current_user.id,
        receiver_id=message.receiver_id,
        content=message.content
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

@router.get("/{user_id}", response_model=list[MessageResponse])
def get_messages(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Security check: Users can only view their own messages
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view these messages")
        
    messages = db.query(Message).filter(
        or_(
            Message.sender_id == user_id,
            Message.receiver_id == user_id
        )
    ).order_by(Message.timestamp.desc()).all()
    
    return messages
