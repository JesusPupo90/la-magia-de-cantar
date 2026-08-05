export default function AchievementsBanner() {
  return (
    <section className="relative z-10 w-full overflow-hidden border-y border-gray-200/80 bg-gray-100/60 py-10 sm:py-12">
      
      

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">

          {/* Mensaje de Autoridad */}
          <div className="text-center lg:col-span-5 lg:text-left">
            <p className="mx-auto max-w-md font-poppins text-xl font-bold leading-snug tracking-tight text-black sm:text-2xl lg:mx-0">
              La plataforma de transformación vocal más elegida por artistas y apasionados del canto.
            </p>
          </div>

          {/* Tarjeta con Cifras de Impacto */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
            <div className="grid grid-cols-3 gap-4 text-center sm:text-left">

              <div>
                <span className="block font-poppins text-3xl font-black text-black sm:text-4xl">
                  +500
                </span>
                <span className="mt-1 block font-jakarta text-xs font-semibold text-gray-900 sm:text-sm">
                  Alumnos formados
                </span>
              </div>

              <div>
                <span className="block font-poppins text-3xl font-black text-pink sm:text-4xl">
                  15+
                </span>
                <span className="mt-1 block font-jakarta text-xs font-semibold text-gray-900 sm:text-sm">
                  Años de trayectoria
                </span>
              </div>

              <div>
                <span className="block font-poppins text-3xl font-black text-black sm:text-4xl">
                  10+
                </span>
                <span className="mt-1 block font-jakarta text-xs font-semibold text-gray-900 sm:text-sm">
                  Programas de TV
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}