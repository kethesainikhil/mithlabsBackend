import { Hono, Next } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { env } from 'hono/adapter'
import { cors } from 'hono/cors'
import { jwt, sign, verify } from 'hono/jwt'
import { setCookie } from 'hono/cookie'
import { deleteCookie } from 'hono/cookie'
const app = new Hono()

app.use('/*', cors(
  {
    origin:"*",
    exposeHeaders: ['Set-Cookie'],
    allowHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    credentials: true
  }
))


// app.use(
//   '/auth/*', async(c, next) => {
//     const { SECRET_KEY } = env<{ SECRET_KEY: string }>(c)
//     const tokenToVerify = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmlraGpqampqaWxsbCIsImVtYWlsIjoia2VlaGVmZm5ubm5mZmhzQGdtYWlsLmNtIiwiZXhwIjoxNzE0MDk4MzU0fQ.pr882AiReVUdqrO4m4GOdrB9zkV607xqlG1bQrsOCTM"

// const decodedPayload = await verify(tokenToVerify, SECRET_KEY)
// if(decodedPayload){
//   c.set("jwtPayload", decodedPayload)
//   await next()
// }
// else{
//   return c.text("not authorizedddd")
// }
//   }
// )

app.get('/auth/page', (c, next) => {

  const payload = c.get('jwtPayload')

  return c.json({payload})

})
app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.post('/addUser', async (c) => {
  const body: {
    name: string;
    email: string;
    password: string;
  } = await c.req.json()
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)

  const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate())

  console.log(body)

  try {
    const payload = {
      name: body.name,
      email: body.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 2, // Token expires in 5 minutes
    }

    const findUser = await prisma.user.findFirst({
      where: {
        email: body.email
      }
    })
    if(findUser) return c.json({msg: "user already exists"})
    const {SECRET_KEY} = env<{SECRET_KEY: string}>(c)
    const token = await sign(payload, SECRET_KEY)
    const res = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password
      },
      select:{
        id:true,
        email:true
      }
    })
    const now = new Date();
const expirationTime = new Date(now.getTime() + 5 * 60 * 1000);
    setCookie(c,"token", token,{
      secure: true,
      expires: expirationTime,
      maxAge: 100000,
      path:"/",

      sameSite:"None"
    })
    c.status(200);
    return c.json({msg: "data successfully inserted into database",data:res,"token":token})
  } catch (error) {
    c.status(400)
    return c.json({msg: error})
  }
})
app.get("/logout", (c) => {
  deleteCookie(c,"token")
  return c.json({msg: "logged out"})
})
interface UserCreateInput {
  hotel_name: string;
  address:  string
  city:  string
  state:  string
  country:  string
  zipcode:  string
  checkin:  string
  checkout:  string
  star_rating:  number
  overview:  string
  rates_from:  number
  image_url:  string
  // other properties...
}
app.post('/addHotels', async (c) => {
  const body: UserCreateInput  = await c.req.json()
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)

  const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate())

  console.log(body)

  try {
    const res = await prisma.hotels.create({
      data: {
        hotel_name: body.hotel_name,
        hotel_address:  body.address,
        hotel_city:  body.city,
        hotel_state:  body.state,
        hotel_country:  body.country,
        hotel_zipcode:  body.zipcode,
        checkin:  body.checkin,
        checkout:  body.checkout,
        star_rating:  body.star_rating,
        overview:   body.overview,
        rates_from:   body.rates_from,
        image_url:  body.image_url,
      },
      select:{
        id:true,
        hotel_name:true
      }
    })
    c.status(200)
    return c.json({msg: "data successfully inserted into database",data:res})
  } catch (error) {
    c.status(400)
    return c.json({msg: error})
  }
})
app.get('/listAllHotels', async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)

  const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate())


  try {
    const res = await prisma.hotels.findMany()
    return c.json({data:res})
  } catch (error) {
    return c.json({msg: error})
  }
})
app.get('/findHotelById/:id', async (c) => {
  const hotel_id = parseInt( c.req.param("id"));

  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)

  const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate())


  try {
    const res = await prisma.hotels.findUnique({
      where:{
        id: hotel_id
      },
    })
    const res2 = await prisma.hotelInteractions.findUnique({
      where:{
        id: hotel_id
      },
    })
    return c.json({data:res,hotelData:res2})
  } catch (error) {
    return c.json({msg: error})
  }
})

app.post('/updateHotelsInter', async (c) => {
  const body: {
    hotel_id: number
    visits?: number
    Drafts?: number
    Bookings?: number
  } = await c.req.json();

  // Destructure the fields with optional chaining and provide default values using nullish coalescing operator
  const { hotel_id, visits = null, Drafts = null, Bookings = null } = body;

  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const res = await prisma.hotelInteractions.update({
      where: {
        id: hotel_id
      },
      data: {
        // Use optional chaining to only update fields if they are provided in the request body
        visits: visits ? { increment: visits } : undefined,
        Drafts: Drafts ? { increment: Drafts } : undefined,
        Bookings: Bookings ? { increment: Bookings } : undefined,
      },
      select: {
        id: true,
        visits: true,
        Drafts: true,
        Bookings: true
      }
    });

    return c.json({ data: res });
  } catch (error) {
    return c.json({ msg: error });
  }
});


export default app
