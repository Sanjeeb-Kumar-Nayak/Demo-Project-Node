const connection = require("./database");

const allDistrict = (req, resp) => {
  connection.query(
    "select district_id, district_name from district order by district_id",
    (error, result) => {
      if (error) {
        let data = { status: 0, message: "Failed", data: result };
        resp.send(data);
      } else {
        let data = {
          status: 1,
          message: "Success",
          totalItems: result.rowCount,
          data: result.rows,
        };
        resp.send(data);
      }
    }
  );
};

const allBlock = (req, resp) => {
  const { districtId } = req.body;

  let query = "select block_id, block_name from block where 1=1";

  if (districtId) query += ` and district_id = '${districtId}'`;

  query += ` order by block_id`;

  connection.query(query, (error, result) => {
    if (error) {
      let data = { status: 0, message: "Failed", data: result };
      resp.send(data);
    } else {
      let data = {
        status: 1,
        message: "Success",
        totalItems: result.rowCount,
        data: result.rows,
      };
      resp.send(data);
    }
  });
};

module.exports = {
  allDistrict,
  allBlock,
};
