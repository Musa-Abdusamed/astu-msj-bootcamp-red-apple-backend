const User = require('../models/User');

const generateCustomId = async (role, year) => {
    let roleCode = '';
    
    if (role === 'student') roleCode = 'st';
    else if (role === 'mentor') roleCode = 'mnt';
    else if (role === 'admin') roleCode = 'adm';
    else throw new Error('Invalid role for ID generation');

    const shortYear = year.toString().slice(-2);
    const prefix = `msj${roleCode}/`;
    const regexPattern = `^${prefix}\\d{5}/${shortYear}$`;

    const lastUser = await User.findOne({
        userId: { $regex: regexPattern }
    }).sort({ createdAt: -1 });

    let nextSequence = 1;
    
    if (lastUser && lastUser.userId) {
        const parts = lastUser.userId.split('/');
        
        if (parts.length === 3) {
            const lastSequence = parseInt(parts[1], 10);
            if (!isNaN(lastSequence)) {
                nextSequence = lastSequence + 1;
            }
        }
    }

    const paddedSequence = nextSequence.toString().padStart(5, '0');

    return `${prefix}${paddedSequence}/${shortYear}`;
};

module.exports = generateCustomId;