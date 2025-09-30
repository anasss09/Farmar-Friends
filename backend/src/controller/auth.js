import ErrorHandler from "../utils/ErrorHandler.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import User from '../model/auth.js'
import uploadOnCloudinary from "../utils/upload.js";

export const postSignup = ErrorWrapper(async (req, res, next) => {
    try {
        const { username, email, password, name } = req.body;

        const requiredField = ['username', 'email', 'password', 'name']
        const incomingField = Object.keys(req.body);
        const missingField = requiredField.filter(field => !incomingField.includes(field))

        if (missingField.length > 0) {
            throw new ErrorHandler(400, `Fills these ${missingField} fields`)
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            throw new ErrorHandler(400, "This user is already Exist");
        }

        const cloudinaryResponse = await uploadOnCloudinary(req.file.path)

        if (!cloudinaryResponse) {
            throw new ErrorHandler(400, "Error in Cloudinary Response")
        }

        const user = await User.create({
            username,
            email,
            password,
            name,
            image: cloudinaryResponse.url
        });

        const newUser = await User.findOne({
            _id: user._id,
        }).select('-password')

        res.status(200).json({
            message: "User created Successfully",
            success: true,
            User: newUser
        })

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, `Error in SignUp ${error}`)
    }
});

const generateAccessAndRefreshToken = async (userId) => {
    try {
        let user = await User.findOne({
            _id: userId
        })

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, `Error in generating access token ${error}`)
    }
}

export const postLogin = ErrorWrapper(async (req, res, next) => {
    try {
        const { username, email, password } = req.body

        if (!username && !email) {
            throw new ErrorHandler(400, 'Enter either username or email')
        }

        if (!password) {
            throw new ErrorHandler(400, 'Enter the password')
        }

        let user = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (!user) {
            throw new ErrorHandler(404, 'User not found, Please sign in')
        }

        const passwordMatch = await user.isPasswordCorrect(password)
        if (!passwordMatch) {
            throw new ErrorHandler(401, 'Password is incorrect')
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

        user.refreshToken = refreshToken
        await user.save()

        user = await User.findOne({
            $or: [{ username }, { email }]
        }).select('-password -refreshToken')

        res.status(200)
            .cookie('AccessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                path: '/'
            })
            .cookie('RefreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                path: '/'
            }).json({
                success: true,
                message: 'Login Successful',
                User: user
            })

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, `Error in Login ${error}`)
    }
})

// Google Login
export const googleCallback = async (req, res) => {
    try {
        const user = req.user;

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res
            .cookie("AccessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
            })
            .cookie("RefreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
            })
            .json({
                success: true,
                message: "Google login successful",
                User: user
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Google login failed" });
    }
};


export const getLogout = ErrorWrapper(async (req, res, next) => {
    res.status(200)
        .cookie('AccessToken', '', {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: '/',
            expires: new Date(0)
        })
        .cookie('RefreshToken', '', {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: '/',
            expires: new Date(0)
        })
        .json({
            success: true,
            message: 'Logout Successful',
        });
});
