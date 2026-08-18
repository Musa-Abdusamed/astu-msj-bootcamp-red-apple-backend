const User = require('../models/User');

/**
 * Generates a custom ID based on role and cohort year (e.g., msj-st-1-2027)
 * @param {String} role - 'student', 'mentor', or 'admin'
 * @param {String} year - The cohort year (e.g., '2027')
 * @returns {String} - The generated unique ID
 */
const generateCustomId = async (role, year) => {
    let roleCode = '';
    
    if (role === 'student') roleCode = 'st';
    else if (role === 'mentor') roleCode = 'mnt';
    else if (role === 'admin') roleCode = 'adm';
    else throw new Error('Invalid role for ID generation');

    const pattern = `msj-${roleCode}-`;

    const lastUser = await User.findOne({
        userId: { $regex: `^${pattern}\\d+-${year}$` }
    }).sort({ createdAt: -1 });

    let nextSequence = 1;
    if (lastUser && lastUser.userId) {
        const parts = lastUser.userId.split('-');
        if (parts.length === 4) {
            const lastSequence = parseInt(parts[2], 10);
            if (!isNaN(lastSequence)) {
                nextSequence = lastSequence + 1;
            }
        }
    }

    return `${pattern}${nextSequence}-${year}`;
};

module.exports = generateCustomId;