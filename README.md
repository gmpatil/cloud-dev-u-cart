# U Cart
Online Store of Stores for groceries and commodity consumer items.

Below back-end REST services are implemented.
- User Service
- Store Service
- Store-Item Service (Catalogs)
- Cart Service
- Order Services

Front-end, payment processing functionalities are yet to be implemented.

## User Service
Allows Auth0 authenticated user to self create, update details. Admin and User roles defined in Auth0 are used authorize/restrict services.

## Store Service
Lets Admin users create Store and update details.

## Item Service
Store-Item service will Admin users to add items to their store.

### Cart Service
Let's user create atmost one cart per store at a time.

### Order Service
Lets user submit orders to stores. Store Admin users can get list of orders for their stores and update fulfilment statuses.

# To Test Services
- Import the test collection into Postman from file [ucart.postman_collection.json](https://github.com/gmpatil/cloud-dev-u-cart/blob/master/ucart.postman_collection.json).
- Select Collection "Runner"
- Select Collection "-1_Common_AWS-Local" in the Runner.
- Select "AWS" environment.
- Click Run
See [screen-shots](https://github.com/gmpatil/cloud-dev-u-cart/tree/master/backend/screenshots) for more details.





