import type { NextPage } from "next";
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from "@react-three/drei";
import Lights from "../src/components/Light";
import Ground from "../src/components/Ground";
import  Trees from '../src/components/Trees';
import Player from "../src/components/Player";

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
      <Player />
    </Canvas>
    </div>
  )
}

export default Home;