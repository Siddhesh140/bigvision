// File: app/components/Testimonials.js
import Image from 'next/image';

const Testimonials = () => {
  return (
    <section className="w-full flex flex-col items-center py-20 px-20 gap-16" style={{ backgroundColor: '#151515' }}>
      <div className="text-center flex flex-col items-center gap-8">
        <h2 className="text-6xl font-bold text-white" style={{ fontFamily: "'Integral CF', sans-serif" }}>
          Client Wins
        </h2>
        <p className="text-xl text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>
          Real results from real manufacturing leaders
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className="flex flex-row gap-7 w-full max-w-7xl">
        {/* Card 1 */}
        <div className="flex-1 flex flex-col justify-between p-8 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]" style={{ backgroundColor: '#191919' }}>
          <div className="flex flex-col gap-10">
            <div className="flex flex-row items-center gap-3">
                <div className="relative w-14 h-14">
                    <Image src="/frame.png" alt="Quote icon" layout="fill" objectFit="contain" />
                </div>
                <div className="relative w-[177px] h-px">
                    <Image src="/Line 1.png" alt="Separator line" layout="fill" objectFit="cover" />
                </div>
            </div>
            <p className="text-xl text-white h-48" style={{ fontFamily: "'Roboto Mono', monospace" }}>
              "Fresh content, every week — without lifting a finger. I finally stopped worrying about what to post."
            </p>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full relative border-2 border-gray-700">
              <Image src="/karthikeyan jawahar.jpeg" alt="Karthikeyan Jawahar" layout="fill" objectFit="cover" className="rounded-full" />
            </div>
            <div>
              <p className="text-lg font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>Karthikeyan Jawahar</p>
              <p className="text-base text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>Director, Karma Innovations</p>
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="flex-1 flex flex-col justify-between p-8 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]" style={{ backgroundColor: '#191919' }}>
          <div className="flex flex-col gap-10">
            <div className="flex flex-row items-center gap-3">
                <div className="relative w-14 h-14">
                    <Image src="/frame.png" alt="Quote icon" layout="fill" objectFit="contain" />
                </div>
                <div className="relative w-[177px] h-px">
                    <Image src="/Line 1.png" alt="Separator line" layout="fill" objectFit="cover" />
                </div>
            </div>
            <p className="text-xl text-white h-48" style={{ fontFamily: "'Roboto Mono', monospace" }}>
              "They turn raw ideas into strong content that brings real leads. That's the difference."
            </p>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full relative border-2 border-gray-700">
              <Image src="/anand mulay.jpeg" alt="Anand Mulay" layout="fill" objectFit="cover" className="rounded-full" />
            </div>
            <div>
              <p className="text-lg font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>Anand Mulay</p>
              <p className="text-base text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>MD, Renuka Tools</p>
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="flex-1 flex flex-col justify-between p-8 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]" style={{ backgroundColor: '#191919' }}>
          <div className="flex flex-col gap-10">
            <div className="flex flex-row items-center gap-3">
                <div className="relative w-14 h-14">
                    <Image src="/frame.png" alt="Quote icon" layout="fill" objectFit="contain" />
                </div>
                <div className="relative w-[177px] h-px">
                    <Image src="/Line 1.png" alt="Separator line" layout="fill" objectFit="cover" />
                </div>
            </div>
            <p className="text-xl text-white h-48" style={{ fontFamily: "'Roboto Mono', monospace" }}>
              "Earlier, I avoided social media. Now it works quietly in the background — just like a good machine should."
            </p>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full relative border-2 border-gray-700">
              <Image src="/dinesh alone.jpeg" alt="Dinesh Alone" layout="fill" objectFit="cover" className="rounded-full" />
            </div>
            <div>
              <p className="text-lg font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>Dinesh Alone</p>
              <p className="text-base text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>Director, Vibex Machines</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;