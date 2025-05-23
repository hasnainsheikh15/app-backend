import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user detauils from the frontend
  // validate the data received in the frontend
  // check if the user already exixts or not
  // if not ? create the user : say already existed
  // if not then take the username password email and fullName from the user
  // now take the avatar and coverImage and uppload it to the cloudinary
  // create the user object and save it to the database as it is nosql database
  // remove the password and refrsh token from the response
  // return the response ...

  if (!req.body || !req.body.fullName) {
    throw new ApiError(400, "All fields are required");
  }
  const { fullName, username, email, password } = req.body; // taking the data from the postman as a frontend..
  //  console.log(username);
  const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailToValidate = email.trim().toLowerCase();
  if (
    // this is basically an js inbuild function which checks if the fields in the array is present and if it is present and then it will trim it and if the output after trim is empty then it will return true and if the fields are present then it will return false.And this function will traverse on all the fiels in the array and work like an operator
    [fullName, username, email, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!regEx.test(emailToValidate)) {
    throw new ApiError(400, "Email is not valid");
  }

  // check if the user is present or not

  const userExisted = await User.findOne({
    $or: [{ username }, { email }], // this is an or operator which will check if the username or email is present in the database , commonly called as filterQuery in mogoDb and this does not work in plain js .
  });

  // final condition for the user to be present or not
  if (userExisted) throw new ApiError(409, "User already exists");

  // now for the avatar and coverImages

  const avatarLocalPath = req.files?.avatar[0]?.path; // this is because i have used the multer middleware and this is the path where the image is stored in the local storage
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  // this chaining operator provides the unexpected and unreadable error so better is to check the existance of the file by traditional if else method

  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // this will avoid unnecessary error in the code if the coverImage is not immediately checked like the avatar so better use this syntax if you dont want to just immediately check it ....
  // as this parameter was set to required : false then too it was throwing error in the psotman because of that chaining syntax so better to check it like this.
  // after this no error will be showned and that will execute properly even if the coverImage is not uploaded .

  // now check if the avatar is given or not

  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  // now uploading on the cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // again check if the avatar is uploaded or not
  if (!avatar) throw new ApiError(500, "Avatar is not uploaded");

  // now create the user object and save it to the database
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email: emailToValidate,
    password,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!userCreated)
    throw new ApiError(
      500,
      "Something went wrong while registering the User..."
    );

  // send the response to the client about the registeration
  return res
    .status(201)
    .json(new ApiResponse(201, userCreated, "User registered Successfully"));
});

// rather than generating the access and refresh token every time lets make an global function to do that

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await user.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // this is done to avoid the validation of the user schema as we are not updating the password and we don't want to check for the password again and again so this is done to avoid that validation
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating the tokens");
  }
};
// req - > body
// check username or email
// check if user exist or not
// check for the password
// access and refresh tokens are generated
// send response of success or failure

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    // this call is basically made to remove the password and refresh token fields
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          refreshToken, // and this shortHand syntax of the js
          accessToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findById(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
export { registerUser, loginUser, logoutUser };
