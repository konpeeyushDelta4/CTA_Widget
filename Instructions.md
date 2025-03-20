//templates/allTemplates.json
const ALL_TEMPLATES = {
  version: 1,
  templates: [
    {
      id: "whatsapp-template1",
      templateId: "whatsapp-chat",
      slug: "whatsapp-chat",
      name: "Whatsapp Chat",
      description: "Whatsapp Chat",
      image: "https://yourgpt.ai/images/templates/whatsapp-chat.png",
      tags: ["whatsapp", "chat"], //For Search
      category: "whatsapp",
      isActive: true,
    },
  ],
};


//templates/config.json
//ALL WIDGET SHARING THIS
const WIDGET_CONFIG = {
  layout: {
    position: {
      side: "left",
      positionX: 20,
      positionY: 20,
    },
    size: 42,
  },
};




//templates/whatsapp/whatsapp-template1.json
const WHATSAPP_TEMPLATE1 = {
  variant: 1,
  dataFields: [
    {
      dataType: "number",
      label: "Phone Number",
      name: "phone",
      placeholder: "Enter your phone number",
      required: true,
    },
    {
      dataType: "text",
      label: "Name",
      name: "name",
      placeholder: "Enter your name",
      required: true,
    },
    {
      dataType: "text",
      label: "Welcome Message",
      name: "welcomeMessage",
      placeholder: "Enter your welcome message",
      required: true,
    },
    {
      dataType: "url",
      label: "Avatar",
      name: "avatar",
      placeholder: "Enter your avatar url",
      required: true,
    },
  ],
};

# Approach-1
I want to implement that whatever config we have in our java script and css, which is like config, such as height, width position, so these are things which are config, they don't effect the functionality much they are just initialized
So I was thinking of implementing that whatever the basic config we will have in widget-config.json
and the rest can be handled in seperated templates json

# Step-1 
okay in my public folder create config json accordiing to the instructions which i've mentioned, take inputs from widget.js and widget.css, 
in config folder there will be fewthings
1.  //templates/allTemplates.json
2. //templates/widget-config.json
3. //templates/whatsapp/whatsapp-template.json
4. //templates/telegram/telegram-template.json

# Step-2
So these config files are in my public folder, when I'll deploy this on build and whatever config we have in script.js we will fetch it from json for different templates, so suggest changes accodingly

# Approach-2 
I was planning of building a landing page which will fetch all the templates from allTemlplates.json
so the templates will be shown on the landing page like telegram and whatsapp for now
when user clicks on a particular template it will move to that route, I will use react-router
/home
/home/whatsapp
/home/telegram
Individual page will handle all the customization
Lets make these changes for now in our src
I've already installed react-router