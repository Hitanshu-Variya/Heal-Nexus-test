const VerificationCodeTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your Email</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <style> 
        * { margin: 0; padding: 0; box-sizing: border-box; color: aliceblue; }
        body { 
            width: 100%; 
            font-family: 'Roboto', sans-serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            background-color: #f0f0f0; 
            height: 100vh; 
        }
    </style>
</head>

<body>
    <div style="background-color: black; max-width: 600px; width: 100%; padding: 20px; text-align: center; border-radius: 10px;">
        <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: auto;">
            <img style="margin-left: 30%; width: 50px; margin-right: 10px;" src="cid:../public/Images/Logo.png" alt="HealNexus logo">
            <p style="font-weight: 500; font-size: 24px; margin-top: 5px;">Heal Nexus</p>
        </div>
        <hr style="margin-top: 10px; background-color: aqua; border: none; height: 2px;">
        <div> 
            <img style="width: 100%; max-width: 500px; margin: 0;" src="cid:../public/Images/VerificationCodeTemplate.png" alt="Verification Code Image"> 
        </div>
        <div style="color: white;">
            <p>Hello, {Username}</p>
            <p>Thank you for signing up! Your verification code is:</p>
            <div style="display: flex; justify-content: center;">
                <div style="background: rgba(0, 62, 58, 0.86); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(0px); border: 1px solid rgba(0, 62, 58, 1); border-radius: 20px; font-size: 50px; padding: 10px 20px; text-align: center;  margin: 20px auto;">
                    {Verification Code}
                </div>
            </div>
            <p style="margin-top: 20px;">Enter this code on the verification page to complete your registration.</p>
            <p>This code will expire in 15 minutes for security reasons.</p>
            <p style="margin-top: 20px;">If you didn't create an account with us, please ignore this email.</p>
            <p style="margin-top: 20px;">Best regards,<br>Heal Nexus Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;

const WelcomeEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Heal Nexus</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; color: aliceblue; }
        body { 
            width: 100%; 
            font-family: 'Roboto', sans-serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            background-color: #f0f0f0; 
        }
    </style>
</head>

<body>
    <div style="background-color: black; max-width: 600px; width: 100%; padding: 20px; text-align: center; border-radius: 10px;">
        <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: auto;">
            <img style="margin-left: 30%; width: 50px; margin-right: 10px;" src="cid:../public/Images/Logo.png" alt="ExpenFlow logo">
            <p style="font-weight: 500; font-size: 24px; margin-top: 5px;">Heal Nexus</p>
        </div>
        <hr style="margin-top: 10px; background-color: aqua; border: none; height: 2px;">
        <div> 
            <img style="width: 70%; max-width: 500px; margin: 0;" src="cid:../public/Images/WelcomeTemplate.png" alt="Welcome Image"> 
        </div>
        <div style="color: white;">
            <p style="margin-top: 20px; font-size: x-large;">Welcome, {Username}</p>
            <p>Welcome to Heal Nexus! We're excited to have you on board.</p>
            <p>With Heal Nexus, managing your finances has never been easier. Track your spending, set budgets, and achieve your financial goals—all in one place.</p>
            <p>Here's what you can do:</p>
            <div style="text-align: center; margin: 20px; color: aliceblue;">
                <p>Track expenses and categorize them effortlessly</p>
                <p>Create budgets and stay on top of your finances</p>
                <p>Generate reports to better understand your spending habits</p>
                <p>Get insights and tips to improve your financial well-being</p>
            </div>
            <p style="margin-top: 20px;">Start exploring by logging into your account and setting up your first budget.</p>
            <p style="margin-top: 20px;">If you need any assistance, feel free to reach out to our support team.</p>
            <p style="margin-top: 20px;">Best regards,<br>Heal Nexus Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;

const ResetPasswordEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; color: aliceblue; }
        body { 
            width: 100%; 
            font-family: 'Roboto', sans-serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            background-color: #f0f0f0; 
        }
    </style>
</head>

<body>
    <div style="background-color: black; max-width: 600px; width: 100%; padding: 20px; text-align: center; border-radius: 10px;">
        <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: auto;">
            <img style="margin-left: 30%; width: 50px; margin-right: 10px;" src="cid:../public/Images/Logo.png" alt="ExpenFlow logo">
            <p style="font-weight: 500; font-size: 24px; margin-top: 5px;">Heal Nexus</p>
        </div>
        <hr style="margin-top: 10px; background-color: aqua; border: none; height: 2px;">
        <div> 
            <img style="width: 75%; max-width: 500px; margin: 0;" src="cid:../public/Images/ResetPasswordTemplate.png" alt="Reset Password Image"> 
        </div>
        <div style="color: white;">
            <p style="margin-top: 20px; font-size: x-large;">Hello, {Username}</p>
            <p>We received a request to reset your password. </p>
            <p>To reset your password, please click the link below:</p>
            <a href="{ResetLink}" style="display: inline-block; background-color: #00aa9a; padding: 15px 25px; font-size: 16px; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Reset Password</a>
            <p style="margin-top: 20px;">This link will expire in 1 Hour for security reasons.</p>
            <p>If you didn’t request a password reset, please ignore this message.</p>
            <p style="margin-top: 20px;">Best regards,<br>Heal Nexus Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;

const PasswordResetSuccessTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; color: aliceblue; }
        body { 
            width: 100%; 
            font-family: 'Roboto', sans-serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            background-color: #f0f0f0; 
        }
    </style>
</head>

<body>
    <div style="background-color: black; max-width: 600px; width: 100%; padding: 20px; text-align: center; border-radius: 10px;">
        <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: auto;">
            <img style="margin-left: 30%; width: 50px; margin-right: 10px;" src="cid:../public/Images/Logo.png" alt="ExpenFlow logo">
            <p style="font-weight: 500; font-size: 24px; margin-top: 5px;">Heal Nexus</p>
        </div>
        <hr style="margin-top: 10px; background-color: aqua; border: none; height: 2px;">
        <div> 
            <img style="width: 75%; max-width: 500px; margin: 0;" src="cid:../public/Images/PasswordResetSuccessTemplate.png" alt="Password Reset Successful Image"> 
        </div>
        <div style="color: white;">
            <p style="margin-top: 20px; font-size: x-large;">Hello, {Username}</p>
            <p>Your password has been successfully reset.</p>
            <p style="margin-top: 20px;">If this action was performed by you, no further action is required. </p>
            <p> You can now log in using your new password.</p>
            <p style="margin-top: 20px;">If you did not request a password reset or believe there has been unauthorized access to your account, please contact our support team immediately.</p>
            <p style="margin-top: 20px;">Best regards,<br>Heal Nexus Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;

export { VerificationCodeTemplate, WelcomeEmailTemplate, ResetPasswordEmailTemplate, PasswordResetSuccessTemplate };