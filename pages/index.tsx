import type { NextPage } from "next";
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats, useTexture } from "@react-three/drei";
import Lights from "../components/Light";
import Ground from "../components/Ground";
import  Trees from '../components/Trees';

const Home: NextPage = () => {
  const testing = true

  return (
    <div className="container">
    <Canvas shadows>
      {testing ? <>
        <Stats />
        <axesHelper args={[2]} />
        <gridHelper args={[50,50]} />
      </> : null}
      <OrbitControls />
      <Trees boundary={50} count={50} />
      
      <Lights />
      <Ground />
    
    </Canvas>
    </div>
  )
}

export default Home;