const User = require('../models/User');

/**
 * Generates a custom ID based on role and cohort year (e.g., msjst/00001/26)
 * @param {String} role - 'student', 'mentor', or 'admin'
 * @param {String|Number} year - The cohort year (e.g., '2026' or 2026)
 * @returns {String} - The generated unique ID
 */
const generateCustomId = async (role, year) => {
    let roleCode = '';
    
    if (role === 'student') roleCode = 'st';
    else if (role === 'mentor') roleCode = 'mnt';
    else if (role === 'admin') roleCode = 'adm';
    else throw new Error('Invalid role for ID generation');

    // 1. Format the year to be 2 digits (e.g., '2026' -> '26')
    const shortYear = year.toString().slice(-2);

    // 2. The base prefix (e.g., 'msjst/')
    const prefix = `msj${roleCode}/`;

    // 3. Regex to find IDs like msjst/00001/26
    const regexPattern = `^${prefix}\\d{5}/${shortYear}$`;

    // Find the latest user with this specific pattern
    const lastUser = await User.findOne({
        userId: { $regex: regexPattern }
    }).sort({ createdAt: -1 });

    // 4. Default to sequence 1 if no users exist yet
    let nextSequence = 1;
    
    if (lastUser && lastUser.userId) {
        // Split by '/' -> ['msjst', '00014', '26']
        const parts = lastUser.userId.split('/');
        
        if (parts.length === 3) {
            // The sequence is now the middle part (index 1)
            const lastSequence = parseInt(parts[1], 10);
            if (!isNaN(lastSequence)) {
                nextSequence = lastSequence + 1;
            }
        }
    }

    // 5. Pad the sequence with zeros to guarantee 5 digits (e.g., '1' -> '00001')
    const paddedSequence = nextSequence.toString().padStart(5, '0');

    // Combine it all together!
    return `${prefix}${paddedSequence}/${shortYear}`;
};

module.exports = generateCustomId;