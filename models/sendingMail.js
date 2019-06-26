const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.PASS
    }
});

let port = process.env.PORT || 3000;
const host = `firstnodeproject23.herokuapp.com`;
module.exports.sendResetPassword = (username, emailID, token) => {
    const htmlstr = `
        <h1> Hey ${username}, </h1>
        <p> Click this <a href = "http://${host}/admin/forgetpass/${token}"> Link </a> for password reset </p>
    `;
// localhost:${port}
// firstnodeproject23.herokuapp.com
// git add .
// git commit -am "make it better"
// git push heroku master

    const mailOptions = {
        from: process.env.GMAIL,
        to: emailID,
        subject: 'Password Reset',
        html: htmlstr
    };

    return transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        else console.log('Email sent: ' + info.response);
    });
}