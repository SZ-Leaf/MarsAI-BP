import db from "../../config/db_pool.js";

const getAllAwards = async() => {
    const [rows] = await db.pool.execute(
        "SELECT id, title, rank, cover, submission_id FROM awards ORDER BY rank ASC"
    );
    return rows;
};

const getAwardById = async(id) => {
    const [rows] = await db.pool.execute(
        "SELECT id, title, rank, cover, description, created_at, submission_id FROM awards WHERE id = ?", [id]
    );
    return rows[0];
};
const createAward = async ({
  title,
  rank,
  submission_id = null,
  cover = null,
  description = null,
}) => {
  const [result] = await db.pool.execute(
    `INSERT INTO awards (title, rank, submission_id, cover, description)
     VALUES (?, ?, ?, ?, ?)`,
    [title, rank, submission_id, cover, description]
  );

  return { id: result.insertId };
};
const updateAward = async (
  id,
  { title, rank, submission_id = null, cover, description }
) => {
  const [result] = await db.pool.execute(
    `UPDATE awards
     SET title = ?, rank = ?, submission_id = ?, cover = ?, description = ?
     WHERE id = ?`,
    [title, rank, submission_id, cover, description, id]
  );

  return result;
};
const deleteAward = async (id) => {
  const [result] = await db.pool.execute(
    "DELETE FROM awards WHERE id = ?",
    [id]
  );
  return result;
};
const getUnassignedAwards = async () => {
  const [rows] = await db.pool.execute(
    `SELECT id, title, rank
     FROM awards
     WHERE submission_id IS NULL
     ORDER BY rank ASC`
  );
  return rows;
};
const setAwardSubmission = async (awardId, submissionId) => {
  const [result] = await db.pool.execute(
    `UPDATE awards
     SET submission_id = ?
     WHERE id = ?`,
    [submissionId, awardId]
  );

  return result;
};
const getAwardsBySubmissionId = async (submissionId) => {
  const [rows] = await db.pool.execute(
    `SELECT id, title, rank, cover
     FROM awards
     WHERE submission_id = ?
     ORDER BY rank ASC`,
    [submissionId]
  );
  return rows;
};

export default {getAllAwards, getAwardById, createAward, updateAward, deleteAward, getUnassignedAwards, setAwardSubmission, getAwardsBySubmissionId}