# DevSkip API's

# AuthRoute
- POST /signup
- POST /login
- POST /logout

# ProfileRoute
- GET /profile
- PATCH /profile/edit
- PATCH /profile/password

# ConnectionRoute
- POST /request/send/dope/:touserId
- POST /request/send/nope/:touserId
- POST /request/review/accept/:requestId
- POST /request/review/reject/:requestId

# userRoute
- GET user/requests/recieved
- GET user/connections
- GET user/feed 


# Pagination 
- feed?page=1&limit=10 => page=1 , limit 1-10
- feed?page=2&limit=10 => page=2 , limit 11-20
- feed?page=3&limit=10 => page=3 , limit 21-30 

.skip(page-1*limit)
.limit(limit)


