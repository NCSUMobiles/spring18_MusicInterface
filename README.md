# Documentation for Music Interface

## Artifacts
The following artifacts can be found in the Deliverables folder:
* Sketches of initial designs and wireframes
* Slide decks showing our progress and final product
* Documentation for the application
* A video demo of the application

## Video Demo
A video demo of the application can be found [here](https://m.youtube.com/watch?v=BzfCrF2msBk&feature=youtu.be).

## Problem
Design students in NC State’s ADN 460 course have developed an AV Instrument called Elemental in which users’ motions are tracked and influence visual and audio responses in a designated space. They have created four different themes (earth, water, fire, air) for the AV Instrument. Without an external interface, Elemental’s themes and user settings can only be altered by the computer on which it is running. In order to make Elemental more engaging for users, we developed a mobile application which allows individual users to customize their blob color and switch between the available themes. 

## How it works
Using a tile-based layout, similar to Windows, we created a simple visual interface for users of the space to interact in a more personal way. Our app is intended to be mounted next to the visual display, allowing users of the space to change the parameters of the experience. Currently, users can change the overall theme of the visual display, or they can change the individual colors of each person. As users leave and enter the space, tiles are created and destroyed to represent the number of current users. Tapping a tile reveals a dropdown panel with settings corresponding to that tile.

Our design of the app heavily coincides with the visual goal of the design team, choosing to use visual indicators over text menus. Because of this, there is no text in our app, only tiles and icons. We aimed to create a visual interface that was clear in purpose and usable, but promoted curiosity and interaction from the user. We believe that the colors and icons successfully accomplished this goal, bringing an intuitive and visually-appealing experience to the users.

## Unfinished work
When we initially designed the app, we planned to incorporate settings for multiple aspects of Elemental, including the following: audio and visual settings for an individual user, and the overall theme. We were unable to accomplish the audio settings due to unexpected side tasks from the design team. These include being asked to help the design students with their own code, explore Game of Life implementations, and connect Processing and React Native with OSC. Additionally, because the design students frequently changed their vision for Elemental, many of our initial design and functionality ideas had to evolve or change with theirs. We think the addition of simple toggles would be useful for changing audio aspects such as volume and pitch, allowing users to change their audio experience in addition to the visual experience. Now that we have established a channel for communicating between our app and the other environments, these additions would be simple to add in the future.

## Software needed to run app:
Node.js (v9.0.0)
Processing (v3.3.7)
FlexCam (developed by Todd Berreth)

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).
