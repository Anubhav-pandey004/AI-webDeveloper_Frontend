
const formatAiRes = ({message , count=1}) => {
  try {    
    let cleanedMessage = message
      .replace(/```/g, "") // Remove all backticks
      .replace(/^json\n/, "") // Remove leading "json\n"
      .trim(); // Remove extra spaces

    // Convert the cleaned JSON string to an object
    const messageObject = JSON.parse(cleanedMessage);
    return messageObject;
  } catch (error) {
    message += " make updates in this project."
    if (count < 2) {
      message += " make updates in this project.";
      return formatAiRes({ message, count: count + 1 }); // Return recursive call
    } else {
      return { text: "Error in creating project. Try again!" }; // Return a valid object
    }
  }
};

export default formatAiRes;
