import db from "../../config/db_pool.js";

const getAllJuryMembers = async() => {
    const [rows] = await db.pool.execute(
        "SELECT id, cover, firstname, lastname, job FROM jury"
    );
    return rows;
};

const getJuryMemberById = async(id) => {
    const [rows] = await db.pool.execute(
        "SELECT id, cover, firstname, lastname, job from jury WHERE id = ?", [id]
    );
    return rows[0];
};

const createJuryMember = async({cover, firstname, lastname, job}) => {
    const [result] = await db.pool.execute(
        "INSERT INTO jury (cover, firstname, lastname, job) VALUES (?, ?, ?, ?)",[cover, firstname, lastname, job]
    );
    return result.insertId;
};

const updateJuryMember = async(id,{cover, firstname, lastname, job}) => {
    const [result] = await db.pool.execute(
        "UPDATE jury SET cover = ?, firstname = ?, lastname = ?, job = ? WHERE id = ?", [cover, firstname, lastname, job, id]
    );
    return result.affectedRows;
}

const deleteJuryMember = async(id) => {
    const [result] = await db.pool.execute(
        "DELETE FROM jury WHERE id=? ", [id]
    );
    return result.affectedRows;
};

export default {getAllJuryMembers, getJuryMemberById, createJuryMember, updateJuryMember, deleteJuryMember};