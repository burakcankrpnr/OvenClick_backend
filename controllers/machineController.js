const db = require("../config/database");

const getAllMachines = (req, res) => {
  try {
    db.query("SELECT * FROM machine;", (err, result) => {
      if (err) {
        console.log("error");
        res.send("Makineleri alırken hata oluştu");
      } else {
        res.send(result);
      }
    });
  } catch (error) {
    console.error(error);
    res.send("Sunucu hatası");
  }
};

const getMachineById = (req, res) => {
  const machine_id = req.params.machine_id;

  try {
    const sql = "SELECT * FROM machine WHERE machine_id = ?";
    db.query(sql, [machine_id], (err, machine) => {
      if (err) {
        console.error("Makinayı alırken hata oluştu:", err);
        res.send("Makinayı alırken hata oluştu");
      } else if (machine.length > 0) {
        res.json(machine);
      } else {
        res.json({
          message: "Makina bulunamadı",
        });
      }
    });
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.send("Sunucu hatası");
  }
};

const createMachine = (req, res) => {
  const { owner_id, machine_name } = req.body;

  // owner_id'nin var olup olmadığını kontrol etmek için SELECT sorgusu
  const checkUserSql = "SELECT * FROM user WHERE user_id = ?";
  db.query(checkUserSql, [owner_id], (err, user) => {
    if (err) {
      console.error("Kullanıcı doğrulanırken hata oluştu:", err);
      return res.send("Kullanıcı doğrulanırken hata oluştu");
    } else if (user.length === 0) {
      return res.send("Geçersiz owner_id: Kullanıcı bulunamadı");
    } else {
      // Kullanıcı varsa makina oluşturma işlemi
      const createMachineSql =
        "INSERT INTO machine (owner_id, machine_name) VALUES (?, ?)";
      db.query(createMachineSql, [owner_id, machine_name], (err, result) => {
        if (err) {
          console.error("Makina oluşturulurken hata oluştu:", err);
          return res.send("Makina oluşturulurken hata oluştu");
        } else {
          res.send("Makina başarıyla oluşturuldu");
        }
      });
    }
  });
};
const updateMachine = (req, res) => {
  const machine_id = req.params.machine_id;
  const { owner_id, machine_name } = req.body;

  const checkUserSql = "SELECT * FROM user WHERE user_id = ?";
  db.query(checkUserSql, [owner_id], (err, user) => {
    if (err) {
      console.error("Kullanıcı doğrulanırken hata oluştu:", err);
      return res.send("Kullanıcı doğrulanırken hata oluştu");
    } else if (user.length === 0) {
      return res.send("Geçersiz owner_id: Kullanıcı bulunamadı");
    } else {
      const sql =
        "UPDATE machine SET owner_id = ?, machine_name = ? WHERE machine_id = ?";
      db.query(sql, [owner_id, machine_name, machine_id], (err, result) => {
        if (err) {
          console.error("Makina güncellenirken hata oluştu:", err);
          res.send("Makina güncellenirken hata oluştu");
        } else if (result.affectedRows > 0) {
          res.send("Makina başarıyla güncellendi");
        } else {
          res.send("Makina bulunamadı");
        }
      });
    }
  });
};

const deleteMachine = (req, res) => {
  const machine_id = req.params.machine_id;

  const checkSql = "SELECT * FROM machine WHERE machine_id = ?";
  db.query(checkSql, [machine_id], (err, results) => {
    if (err) {
      console.error("Makina kontrol edilirken hata oluştu:", err);
      return res.send("Makina kontrol edilirken hata oluştu");
    }
    const deleteSql = "DELETE FROM machine WHERE machine_id = ?";
    db.query(deleteSql, [machine_id], (err, result) => {
      if (err) {
        console.error("Makina silinirken hata oluştu:", err);
        return res.send("Makina silinirken hata oluştu");
      }

      if (result.affectedRows > 0) {
        return res.send("Makina başarıyla silindi");
      } else {
        return res.send("Makina bulunamadı");
      }
    });
  });
};

module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
};
