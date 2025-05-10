//Authentication: process of verifying someone is
//Authorization: process of verifying what specific applications, files and data a user has access to

//We never store passwords as it is.
//We store their hashed form, they have same output for same input

//HASHING:
//Fixed output for same input
//Fixed length : 50 characters
//One way functions , cant get input from output
//Small changes in input should bring large changes in output

//SALTING: technique to protect passwords stored in databases by adding a string of 32 or more characters and then hashing them

//passport-local-mongoose automatically adds username and password in the schema

//CONFIGURING STRATEGY
//pbkdf2 is the hashing algo used in passport 


//MVC : model , view , controller