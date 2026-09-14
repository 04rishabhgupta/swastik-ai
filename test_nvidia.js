fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer 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"
  },
  body: JSON.stringify({
    model: "mistralai/mistral-nemotron",
    messages: [{"role": "user", "content": "hello"}],
    stream: true
  })
}).then(async res => {
  console.log(res.status);
  const reader = res.body.getReader();
  while(true) {
    const {done, value} = await reader.read();
    if(done) break;
    process.stdout.write(new TextDecoder().decode(value));
  }
}).catch(console.error);
