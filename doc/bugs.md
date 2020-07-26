# Bugs

could be from deleting already deleted entry

Message: Undefined index: user_id
File: /home4/lilplayt/public_html/miniblog/backend/controllers/CUDHandler.php
Line: 79
Trace
#0 /home4/lilplayt/public_html/miniblog/backend/controllers/CUDHandler.php(79): Slim\Slim::handleErrors(8, 'Undefined index...', '/home4/lilplayt...', 79, Array)
#1 [internal function]: CUDHandler->{closure}('11189')

bug 2 - because after delete the entry no longer exists
LoadDay Error TypeError: Cannot read property 'current' of undefined
    at OneDay.js:115
    at l (runtime.js:45)
    at Generator._invoke (runtime.js:274)
    at Generator.forEach.e.<computed> [as next] (runtime.js:97)
    at r (asyncToGenerator.js:3)
    at s (asyncToGenerator.js:25)
