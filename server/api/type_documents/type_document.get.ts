export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const auth = getHeader(event, 'authorization')
  try{
    const response = await $fetch(`${config.public.laravelApiUrl}/type_documents`, {
      headers: {
        Authorization: `Bearer ${auth}`
      }
    });
    return response.data
  }catch(error){
    return error;
  }
})
