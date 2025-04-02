import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const directoryPath = path.join(process.cwd(), "public/image/Picture_KYT"); // โฟลเดอร์ที่ต้องการอ่าน
  try {
    const files = fs.readdirSync(directoryPath); // อ่านไฟล์ทั้งหมด
    res.status(200).json({ files }); // ส่งข้อมูลกลับเป็น JSON
  } catch (error) {
    res.status(500).json({ error: "Cannot read directory" });
  }
}