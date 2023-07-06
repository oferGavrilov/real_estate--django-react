
import { Link } from "react-router-dom"
import { WavesWhite, WavesBlue } from "../assets/icons/Bubble"
export default function Home (): JSX.Element {

      return (
            <section className="">
                  <div className="h-screen relative">
                        <div className="slide-up">
                              <h1
                                    className="text-4xl md:text-8xl font-alfa font-bold pt-10 md:pt-16 pb-14 text-primary text-center 
                              bg-gradient-to-r from-sky-200 via-sky-500 to-blue-400 bg-clip-text text-transparent">
                                    Rolling
                              </h1>
                              <p className="text-center mx-[10%] text-lg md:text-2xl tracking-wide leading-8 md:leading-9 md:[word-spacing:8px]">Discover a new way to connect with our innovative chat website.<br />
                                    From real-time messaging to voice and video calls, our platform brings people together, fostering collaboration, and enabling rich communication experiences.</p>

                              <div className="flex justify-center my-20">
                                    <Link to="/chat" className="bg-primary w-max py-2 px-6 text-xl text-white rounded-xl transition-all shadow duration-300 hover:custom-shadow">Get Started</Link>
                              </div>
                        </div>
                        <WavesBlue />
                  </div>
                  <div className="h-screen bg-primary relative">

                        <WavesWhite />
                  </div>
            </section>
      )
}
