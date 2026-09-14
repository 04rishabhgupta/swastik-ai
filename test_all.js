async function run() {
  const models = require('child_process').execSync('curl -s -X GET "https://integrate.api.nvidia.com/v1/models" -H "Authorization: Bearer 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"').toString();
  const data = JSON.parse(models).data.map(d => d.id).filter(id => id.includes('nemotron'));
  
  console.log("Found nemotron models: ", data);
  
  for (const model of data) {
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model,
        messages: [{"role": "user", "content": "hello"}],
        max_tokens: 10
      })
    });
    console.log(model, res.status);
    if(res.status === 200) break;
  }
}
run();
