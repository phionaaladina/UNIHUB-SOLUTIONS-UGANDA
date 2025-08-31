from flask import Blueprint, request, jsonify
from datetime import datetime
from app.extensions import db
from app.models.chat import Chat

chat = Blueprint('chat', __name__, url_prefix='/api/v1/chat')

@chat.route('/save_message', methods=['POST'])
def save_whatsapp_message():
    try:
        print("Save message route hit!")
        data = request.get_json()
        print("Received data:", data)

        user_id = data.get('userId')
        message = data.get('message')
        timestamp = data.get('timestamp')

        if not user_id:
            return jsonify({"error": "userId is required"}), 400
        if not message:
            return jsonify({"error": "message is required"}), 400

        try:
            timestamp = datetime.fromisoformat(timestamp) if timestamp else datetime.utcnow()
        except Exception:
            timestamp = datetime.utcnow()

        new_chat = Chat(
            user_id=user_id,
            message=message,
            timestamp=timestamp
        )

        db.session.add(new_chat)
        db.session.commit()
        return jsonify({"success": True, "chat_id": new_chat.chat_id}), 200

    except Exception as e:
        print("Error:", str(e))
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
