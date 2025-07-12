const url = "https://api.creatomate.com/v1/renders";
const apiKey =
  "2c499ad3edc244f49ae37681f2a688af410b9b165b1885398b9aed0c6631a4e0cbea0223d0cb448b336bbff258177a4e";

const data = {
  template_id: "2f8c62aa-0c9d-471e-b9a9-1e532e5cc889",
  modifications: {
    "Background.source":
      "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg",
    "Text-1.text.name": "",
    "Text-2.text": "Kitty is cute",
    "Text-3.text": "I'm the chosen one",
    "Text-4.text": "For real? ",
  },
};

fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

  
