import {StreamChat} from "stream-chat"
const apiChat="az7swwjyh7mr";
const secretChat="62j53umaeay6tr433g3h9m889z7xz8xswvawcxr633fphtcevxtabc9jxewp6keq";
const chatClient= StreamChat.getInstance(apiChat,secretChat);


export const chatTokenGenerator=(req,res)=>{
    const {userId}=req.params;
    if (!userId) {
        return res.status(400).json({ error: "user_id is required" });
      }
      try {
        const token=chatClient.createToken(userId);
        res.status(200).json({token});
      } catch (error) {
        res.status(500).json({error:"error in generating token"});
      }
};