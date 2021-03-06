// 存储报修信息
const db = require("../../config/db");
const fs = require("fs");

// 用户提交报修

module.exports = function (req, res) {
  //接收前台数据
  const { u_name, u_mobile, u_identity, address, d_address, rp_describe, rp_time, rp_state } = req.body;
  // 电话号码不符合直接 return
  if (!/^1[3456789]\d{9}$/.test(u_mobile)) return res.sendResult(null, 422, "电话号码格式错误");
  /**
   * 图片处理
   */
  let base64_arr = req.body.rp_pic;
  let img_arr = [];
  // 如果不是数组直接 return
  if (!Array.isArray(base64_arr)) return;
  for (const item of base64_arr) {
    //路径从app.js级开始找--
    let img_path = "./uploads/" + Date.now() + ".png";
    img_arr.push(img_path);
    //去掉图片base64码前面部分data:image/png;base64
    let base64 = (item.content + "").replace(/^data:image\/\w+;base64,/, "");
    //把 base64 码转成buffer对象
    let dataBuffer = new Buffer.from(base64, "base64");
    fs.writeFile(img_path, dataBuffer, function (err) {
      //用fs写入文件
      if (err) {
        console.log(err);
      } else {
        console.log("写入成功！");
      }
    });
  }
  if (img_arr.length === 0) img_arr = "[]";
  let sql = `
  insert into rp_record
  (u_name, u_mobile, u_identity, address, d_address, rp_pic, rp_describe, rp_time, rp_state) 
  values 
  (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  sql = sql.replace(/\n|\r/g, "");
  let sqlArr = [u_name, u_mobile, u_identity, address, d_address, img_arr, rp_describe, rp_time, rp_state];
  let callBack = (err, data) => {
    if (err) {
      console.log("数据库连接出错", err);
      res.sendResult(null, 500, "提交失败，系统故障");
    } else {
      res.sendResult(null, 200, "报修提交成功");
    }
  };
  db.query(sql, sqlArr, callBack);
};
