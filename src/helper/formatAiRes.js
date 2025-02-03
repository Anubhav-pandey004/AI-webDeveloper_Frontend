const formatAiRes = (message) =>{
    let cleanedMessage = message
      .replace(/```/g, "") // Remove all backticks
      .replace(/^json\n/, "") // Remove leading "json\n"
      .trim(); // Remove extra spaces

    // Convert the cleaned JSON string to an object
    const messageObject = JSON.parse(cleanedMessage);
    return messageObject
}

export default formatAiRes