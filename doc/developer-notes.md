# Developer Notes

## Login Flow

```ascii
+-------------------+         +------------------+         +-------------------+
|                   |         |                  |         |                   |
|     Front-end     |         |   Local Backend  |         |  Authentication   |
|     (React)       |         |                  |         |  Endpoint         |
+--------+----------+         +--------+---------+         +---------+---------+
         |                             |                             |
         |                             |                             |
         |                             |                             |
         |     GET Endpoints           |                             |
         +-----------------------------+                             |
         |                             |                             |
         |     return Endpoints        |                             |
         +-----------------------------+                             |
         |                             |                             |
         |                             |                             |
         |     POST Authenticate User  |                             |
         +-----------------------------------------------------------+
         |                             |                             |
         |                             |                             |
         |      return User Info / Token                             |
         +-----------------------------+-----------------------------+
         |                             |                             |
         |                             |                             |
         |                             |                             |
         |                             |                             |
         +                             +                             +

```

After the Endpoints are received, then check for cookie of previous logins.
