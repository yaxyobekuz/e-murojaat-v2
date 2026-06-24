// Kategoriya bo'yicha tabiiy o'zbekcha izoh shablonlari (Sarnovul darajasida).
export const DESCRIPTIONS = {
  ariq_tozalash: [
    "Hovli oldidagi ariq loyqa bilan to'lib qolgan, suv o'tmayapti.",
    "Ko'cha bo'yidagi ariqni tozalash kerak, suvlar toshib ketyapti.",
    "Ariqqa axlat tiqilib qolgan, iltimos tozalab bering.",
    "Yomg'irdan keyin ariq to'lib, hovliga suv kiryapti.",
  ],
  boyoq_ishlari: [
    "Uy peshtoqini bo'yash kerak, eski bo'yoq ko'chgan.",
    "Darvoza va panjarani bo'yab berishni so'rayman.",
    "Devor namlik tortgan, qayta bo'yash zarur.",
  ],
  chiroq_ornatish: [
    "Ko'cha chiroqlari 3 kundan beri yonmayapti, kechqurun qorong'i.",
    "Hovliga yangi chiroq o'rnatib berishni so'rayman.",
    "Mahalla yo'lagidagi chiroq buzilgan, almashtirish kerak.",
  ],
  daraxt_kesish: [
    "Eski terak simlarga tegyapti, kesib berish kerak.",
    "Qurigan daraxt yiqilib ketishi mumkin, xavfli.",
    "Daraxt shoxlari tomga tegyapti, butab bering.",
  ],
  devor_suvoq: [
    "Hovli devori nurab, suvog'i ko'chib tushyapti.",
    "Devorni qayta suvoq qilish kerak, yoriqlar paydo bo'lgan.",
  ],
  elektrik: [
    "Uydagi rozetka ishlamayapti, elektrik kerak.",
    "Hisoblagichdan keyin sim kuyib qolgan.",
    "Chiroqlar o'chib-yonyapti, elektr ta'minoti nosoz.",
  ],
  issiqlik_tizimi: [
    "Radiatorlar isimayapti, qish kelyapti.",
    "Issiqlik qozoni ishlamay qoldi, ta'mirlash kerak.",
    "Trubalarda havo qolgan, isitish tizimi nosoz.",
  ],
  kichik_qurilish: [
    "Hovliga kichik ayvon qurib berishni so'rayman.",
    "Tashqi hojatxona qurish kerak.",
    "Hovli devorini ko'tarib berish kerak.",
  ],
  metall_konstruksiya: [
    "Darvozaga temir karkas yasab berish kerak.",
    "Ayvonga metall naves o'rnatish kerak.",
  ],
  obodonlashtirish: [
    "Mahalla hovlisini ko'kalamzorlashtirish kerak.",
    "Bolalar maydonchasini tartibga keltirib berishni so'rayman.",
    "Ko'cha bo'yiga gul ko'chati ekish kerak.",
  ],
  payvandlash: [
    "Darvoza ilgagi sinib ketgan, payvand qilish kerak.",
    "Temir panjara ajralib qolgan, ulab berish kerak.",
  ],
  qor_tozalash: [
    "Qor bosib qoldi, mahalla ichidagi yo'lni tozalash kerak.",
    "Hovli oldini qordan tozalab bering, chiqib bo'lmayapti.",
    "Yo'lakdagi muzni ko'chirish kerak, sirpanchiq.",
  ],
  qulflash: [
    "Darvoza qulfi singan, ochilmayapti.",
    "Eshik qulfini almashtirish kerak, kalit sinib qoldi.",
  ],
  santexnik: [
    "Hammomda truba teshilgan, suv oqyapti. Tezroq yuboring.",
    "Kran buzilgan, suv to'xtamayapti.",
    "Unitaz bachogi ishlamayapti, ta'mirlash kerak.",
    "Rakovina ostidagi sifon oqyapti.",
  ],
  suv_quvur_tamiri: [
    "Hovlidagi suv quvuri yorilib, suv ko'lmak bo'lyapti.",
    "Ichimlik suvi trubasi ko'mirilgan joydan oqyapti.",
    "Asosiy quvurda bosim yo'q, ta'mirlash kerak.",
  ],
  tamirlash: [
    "Uy eshigi shalvirab qolgan, ta'mirlash kerak.",
    "Deraza romi chirigan, almashtirish zarur.",
    "Pol taxtalari ko'tarilib ketgan.",
  ],
  tom_yopish: [
    "Uyning tomidan suv o'tyapti, shifer ko'chgan.",
    "Tom yopilishini yangilash kerak, eski material chirigan.",
    "Yomg'irdan oldin tomni ta'mirlab berish kerak.",
  ],
  uy_tozalash: [
    "Ko'chib kelganimizdan keyin uyni tozalash kerak.",
    "Ta'mirdan keyin chang-to'zonni yig'ishtirib berishni so'rayman.",
    "Hovli va uyni umumiy tozalash kerak.",
  ],
};

export const pickDescription = (catKey, rand) => {
  const list = DESCRIPTIONS[catKey] || ["Xizmat ko'rsatish so'ralmoqda."];
  return list[Math.floor(rand * list.length)];
};
