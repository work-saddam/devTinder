# DevTinder API

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interested/:toUserId
- POST /request/send/ignored/:toUserId

_From above two apis, we can make only one api to achive same results_.
- - POST /request/send/:status/:toUserId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

_From above two apis, we can make only one api to achive same results_.
- - POST /request/review/:status/:requestId

## userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed  - Gets you the profile of other user on plateform

STATUS: ignored, interested, accepted, rejected