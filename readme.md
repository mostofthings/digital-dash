![Screenshot_1](https://github.com/mostofthings/digital-dash/assets/62969747/06c26d44-7946-418e-8517-8d5e5933e9b5)

# Raspberry Pi Digital Dash

The goal of this project is to create a universal digital gauge readout for racecar applications. The core aims of this project are:

## To display easy to read data in an attractive format.

The final product should, as much as possible, look as good or better than a bank of physical gauges.

![Screenshot_2](https://github.com/mostofthings/digital-dash/assets/62969747/d23a9d9f-4d89-4e75-bbfc-d882e002448e)


## To offer short-term historical data readout.

When driving a racecar under duress, it's often impossible to look at 7-plus-gauges and make sure that everything seems in spec. The ultimate goal of this project is to add a chart of recent historical data - think like a CPU monitor - of relevant data over a short period of time. In the pits or on the grid, the driver can peek at the data and make sure that all the systems of the car are healthy and well, even when operating under extreme conditions.

## To provide this functionality at minimal cost

Fully outfitting a racecar dash can easily cost a couple thousand bucks. One of the goals of this project is to minimize financial input and maximize efficacy and accuracy. That, friends, is the American Dream. To this end, the physical hardware involved is as inexpensive as possible, and the sensors used will, as much as possible, be all off-the-shelf, readily-available, universally-fittable ones from your favorite Large Corporate Autoparts Store.

On the computer hardware side, this project utilizes an Arduino Uno, a Raspberry Pi, and corresponding Pi 7" touch screen. I will be making use of a 3D printer, and wherever possible will be providing .stl files of any custom parts made. 

## To calibrate those sensors as accurately as possible

It's one thing for it to be cheap, and another for it to be cheap AND good. Most automotive sensors operate by providing various levels of resistance under different circumstance, and using the Arduino, we use that resistance to monitor a reference voltage. Most sensors - cheap or expensive, are assumed to have a linear response. Early testing for this project indicates that that's not always the case. 

While Mostly linear, a more curvilinear response is often seen. While this may not seem like that big of a deal, that's wholly dependent on where those curves are. In testing for the water temp sensor, the response of the sensor changes almost exponentially at the top end of its operating range - exactly where we need it the most. Various strategies will be employed to make sure that the readings on the gauge are the actual conditions going on in the car. 

## To allow this project to be replicated by others

If you too have around $250, know your way around a Raspberry Pi functionally well, and possess a willingness to walk into an Autozone, you too can replicate this exact setup. I have in MY mind specific goals for functionality, but I'm sure others may want different results to match with their particular corner of the vehicular world. Other projects similar to this one already exist, but hopefully by providing expanded functionality and ample information, this too can gain a bit of traction. Ultimately, I'll be happy to have the results of this project for myself, but I'd love it if anyone else out there found some utility out of it as well.
