export default {
  async fetch(request) {
    return new Response("Deda Moča je spreman!", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};
