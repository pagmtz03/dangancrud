const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const characters = [
  { name: "Shuichi Saihara", talent: "Detective", gender: "Male", height: "171 cm", weight: "58 kg", birthday: "September 7", image: "/images/shuichi.jpg" },
  { name: "Kaede Akamatsu", talent: "Pianist", gender: "Female", height: "167 cm", weight: "53 kg", birthday: "March 26", image: "/images/kaede.jpg" },
  { name: "Kaito Momota", talent: "Astronaut", gender: "Male", height: "184 cm", weight: "74 kg", birthday: "April 12", image: "/images/kaito.jpg" },
  { name: "Maki Harukawa", talent: "Child Caregiver", gender: "Female", height: "162 cm", weight: "44 kg", birthday: "February 2", image: "/images/maki.jpg" },
  { name: "Kokichi Oma", talent: "Supreme Leader", gender: "Male", height: "156 cm", weight: "44 kg", birthday: "June 21", image: "/images/kokichi.jpg" },
  { name: "Himiko Yumeno", talent: "Magician", gender: "Female", height: "150 cm", weight: "39 kg", birthday: "December 3", image: "/images/himiko.jpg" },
  { name: "K1-B0", talent: "Robot", gender: "None", height: "160 cm", weight: "89 kg", birthday: "October 29", image: "/images/keebo.jpg" },
  { name: "Angie Yonaga", talent: "Artist", gender: "Female", height: "157 cm", weight: "41 kg", birthday: "April 18", image: "/images/angie.jpg" },
  { name: "Gonta Gokuhara", talent: "Entomologist", gender: "Male", height: "198 cm", weight: "94 kg", birthday: "January 23", image: "/images/gonta.jpg" },
  { name: "Kirumi Tojo", talent: "Maid", gender: "Female", height: "176 cm", weight: "52 kg", birthday: "May 10", image: "/images/kirumi.jpg" },
  { name: "Korekiyo Shinguji", talent: "Anthropologist", gender: "Male", height: "188 cm", weight: "65 kg", birthday: "July 31", image: "/images/korekiyo.jpg" },
  { name: "Miu Iruma", talent: "Inventor", gender: "Female", height: "173 cm", weight: "56 kg", birthday: "November 16", image: "/images/miu.jpg" },
  { name: "Rantaro Amami", talent: "???", gender: "Male", height: "179 cm", weight: "62 kg", birthday: "October 3", image: "/images/rantaro.jpg" },
  { name: "Ryoma Hoshi", talent: "Tennis Pro", gender: "Male", height: "105 cm", weight: "40 kg", birthday: "July 1", image: "/images/ryoma.jpg" },
  { name: "Tenko Chabashira", talent: "Aikido Master", gender: "Female", height: "165 cm", weight: "52 kg", birthday: "January 9", image: "/images/tenko.jpg" },
  { name: "Tsumugi Shirogane", talent: "Cosplayer", gender: "Female", height: "174 cm", weight: "51 kg", birthday: "August 15", image: "/images/tsumugi.jpg" }
]

async function main() {
  for (const character of characters) {
    await prisma.character.create({
      data: character
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })