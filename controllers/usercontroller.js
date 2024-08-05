const db = require("../config/database");

const getAllUser = (req, res) => {
  try {
    db.query("SELECT * FROM user;", function (err, result) {
      if (err) {
        console.log("error");
        res.send("Kullanıcıları alırken hata oluştu");
      } else {
        res.send(result);
      }
    });
  } catch (error) {
    console.error(error);
    res.send("Sunucu hatası");
  }
};

const getUserById = (req, res) => {
  const user_id = req.params.user_id;
  try {
    db.query(`SELECT * FROM user WHERE id=${user_id}`, function (err, user) {
      if (err) {
        console.log("error");
        res.send("Kullanıcıyı alırken hata oluştu");
      } else if (user.length > 0) {
        res.send(user);
      } else {
        res.json({
          message: "Kullanıcı bulunamadı",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.send("Sunucu hatası");
  }
};

const createUser = (req, res) => {
  const { username, password, email, role } = req.body;
  const sql =
    "INSERT INTO user (username, password, email, role) VALUES (?, ?, ?, ?)";

  try {
    db.query(sql, [username, password, email, role], (err, result) => {
      if (err) {
        console.error("Kullanıcı oluşturulurken hata oluştu:", err);
        res.send("Kullanıcı oluşturulurken hata oluştu");
      } else {
        console.log("Kullanıcı başarıyla oluşturuldu:", result);
        res.send("Kullanıcı başarıyla oluşturuldu");
      }
    });
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.send("Sunucu hatası");
  }
};

const updateUser = (req, res) => {
  const user_id = req.params.user_id;
  const { username, password, role, email } = req.body;
  console.log(req.body);
  try {
    const sql = `UPDATE user SET username='${username}', role='${role}', email='${email}', password='${password}' WHERE user_id=${user_id}`;
    db.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        res.send("Kullanıcı güncellenirken hata oluştu");
      } else if (result.affectedRows > 0) {
        res.send("Kullanıcı başarıyla güncellendi");
      } else {
        res.send("Kullanıcı bulunamadı");
      }
    });
  } catch (error) {
    console.error(error);
    res.send("Sunucu hatası");
  }
};
const deleteUser = (req, res) => {
  const user_id = req.params.user_id;

  try {
    const deleteMachinesSql = "DELETE FROM machine WHERE owner_id = ?";
    db.query(deleteMachinesSql, [user_id], (err, result) => {
      if (err) {
        console.error("Makineler silinirken hata oluştu:", err);
        return res.send("Makineler silinirken hata oluştu");
      }
      const deleteUserSql = "DELETE FROM user WHERE user_id = ?";
      db.query(deleteUserSql, [user_id], (err, result) => {
        if (err) {
          console.error("Kullanıcı silinirken hata oluştu:", err);
          return res.send("Kullanıcı silinirken hata oluştu");
        }

        if (result.affectedRows > 0) {
          res.send("Kullanıcı ve makineleri başarıyla silindi");
        } else {
          res.send("Kullanıcı bulunamadı");
        }
      });
    });
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.send("Sunucu hatası");
  }
};

module.exports = {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
