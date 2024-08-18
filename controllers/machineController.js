const db = require("../config/database");
const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "../logs/machines");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getLogFileName = (machine_id) => {
  return path.join(logsDir, `${machine_id}.json`);
};

const writeLog = (logData) => {
  const logFileName = getLogFileName(logData.machine_id);
  const timestamp = new Date().toISOString();
  logData.timestamp = timestamp;

  let logs = [];
  if (fs.existsSync(logFileName)) {
    try {
      const fileContent = fs.readFileSync(logFileName, "utf-8");
      logs = JSON.parse(fileContent);
    } catch (err) {
      console.error("Log dosyası okunurken hata oluştu:", err);
    }
  }

  logs.push(logData);

  fs.writeFile(logFileName, JSON.stringify(logs, null, 2), (err) => {
    if (err) {
      console.error("Log yazma hatası:", err);
    }
  });
};

const getAllMachines = (req, res) => {
  const role = req.user.role;
  const user_id = req.user.id;

  let sql = "";
  let params = [];

  switch (role) {
    case "Admin":
      sql = "SELECT * FROM machine;";
      break;
    case "Owner":
      sql = "SELECT * FROM machine WHERE owner_id = ?";
      params = [user_id];
      break;
    case "User":
      sql = "SELECT * FROM machine WHERE user_id = ?";
      params = [user_id];
      break;
    default:
      sql = "SELECT * FROM machine;";
      break;
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Makineleri alırken hata oluştu:", err);
      res.status(500).send("Makineleri alırken hata oluştu");
    } else {
      res.json(result);
    }
  });
};

const getMachineById = (req, res) => {
  const machine_id = req.params.machine_id;

  const sql = "SELECT * FROM machine WHERE machine_id = ?";
  db.query(sql, [machine_id], (err, machine) => {
    if (err) {
      console.error("Makinayı alırken hata oluştu:", err);
      res.status(500).send("Makinayı alırken hata oluştu");
    } else if (machine.length > 0) {
      res.json(machine[0]);
    } else {
      res.status(404).json({
        message: "Makina bulunamadı",
      });
    }
  });
};

const createMachine = (req, res) => {
  const { owner_id, machine_name, details } = req.body;

  const checkUserSql = "SELECT * FROM user WHERE user_id = ?";
  db.query(checkUserSql, [owner_id], (err, user) => {
    if (err) {
      console.error("Kullanıcı doğrulanırken hata oluştu:", err);
      return res.status(500).send("Kullanıcı doğrulanırken hata oluştu");
    } else if (user.length === 0) {
      return res.status(400).send("Geçersiz owner_id: Kullanıcı bulunamadı");
    } else {
      const createMachineSql =
        "INSERT INTO machine (owner_id, machine_name, details) VALUES (?, ?, ?)";

      const detailsJson = JSON.stringify(details);

      db.query(
        createMachineSql,
        [owner_id, machine_name, detailsJson],
        (err, result) => {
          if (err) {
            console.error("Makina oluşturulurken hata oluştu:", err);
            return res.status(500).send("Makina oluşturulurken hata oluştu");
          } else {
            const newMachineId = result.insertId;
            res.status(201).send("Makina başarıyla oluşturuldu");
            writeLog({
              action: "create",
              machine_id: newMachineId,
              machine_name: machine_name,
              details: detailsJson,
            });
          }
        }
      );
    }
  });
};

const updateMachine = (req, res) => {
  const machine_id = req.params.machine_id;
  const { latitude, longitude } = req.body;  

  const sql = "UPDATE machine SET latitude = ?, longitude = ? WHERE machine_id = ?";
  db.query(sql, [latitude, longitude, machine_id], (err, result) => {
    if (err) {
      console.error("Makina güncellenirken hata oluştu:", err);
      return res.status(500).send("Makina güncellenirken hata oluştu");
    } else if (result.affectedRows > 0) {
      res.send("Makina başarıyla güncellendi");
    } else {
      res.status(404).send("Makina bulunamadı");
    }
  });
};


const deleteMachine = (req, res) => {
  const machine_id = req.params.machine_id;

  const checkSql = "SELECT * FROM machine WHERE machine_id = ?";
  db.query(checkSql, [machine_id], (err, results) => {
    if (err) {
      console.error("Makina kontrol edilirken hata oluştu:", err);
      return res.status(500).send("Makina kontrol edilirken hata oluştu");
    }
    const deleteSql = "DELETE FROM machine WHERE machine_id = ?";
    db.query(deleteSql, [machine_id], (err, result) => {
      if (err) {
        console.error("Makina silinirken hata oluştu:", err);
        return res.status(500).send("Makina silinirken hata oluştu");
      }

      if (result.affectedRows > 0) {
        res.send("Makina başarıyla silindi");
        writeLog({
          action: "delete",
          machine_id: machine_id,
        });
      } else {
        res.status(404).send("Makina bulunamadı");
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