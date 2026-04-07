const fs = require('fs');
const path = require('path');

const source = 'C:\\Users\\Parvesh Kumar\\OneDrive\\Desktop\\Profile\\public\\placeholder-user.jpg';
const dest = path.join(__dirname, 'public', 'profile.jpg');

fs.copyFileSync(source, dest);
console.log('Profile image copied successfully!');
