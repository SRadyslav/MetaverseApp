import { useAnimations, useGLTF } from "@react-three/drei"
import { useEffect } from "react"

const Player = () => {
    const model = useGLTF("/models/player.glb")
    const {actions} = useAnimations(model.animations, model.scene)
    
    model.scene.scale.set(0.5,0.5,0.5)
    model.scene.castShadow= true
    

    useEffect(()=>{
        actions?.idle?.play();
    },[])

    return (
        <primitive  object={model.scene} />
    )
}

export default Player