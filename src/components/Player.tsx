import { Vector3, Quaternion} from "three"
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei"
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { useKeys } from "../hooks/useKeys"
import { truncate } from "fs/promises"




let walkDirection = new Vector3()
let rotateAngle = new Vector3(0,1,0)
let rotateQuaternion = new Quaternion()
let cameraTarget = new Vector3()


type DirectionOffSet = {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
}
const directionOffset = ({forward, backward, left, right}: DirectionOffSet ) => {
    let directionOffset  = 0; //w

    if(forward) {
        if(left) {
            directionOffset = Math.PI / 4; // w + a
        } else if(right) {
            directionOffset = -Math.PI / 4; // w + d
        }
    } else if(backward) {
        if(left) {
            directionOffset = Math.PI / 4 + Math.PI / 2 // s + a
        } else if(left) {
            directionOffset = -Math.PI / 4 - Math.PI / 2 // s + d
        } else {
            directionOffset = Math.PI // s
        }
    } else if (left) {
        directionOffset = Math.PI / 2 // a
    } else if (right) {
        directionOffset = -Math.PI / 2 // d
    }

    return directionOffset
}

const Player = () => {
    const model = useGLTF("/models/player.glb")
    const {actions} = useAnimations(model.animations, model.scene)
    const {forward,backward,jump,left,right,shift} = useKeys()
    model.scene.scale.set(2,2,2)
    model.scene.castShadow= true
    model.scene.visible = true
    
    const currentAction = useRef("")
    const controlRef = useRef<OrbitControlsType>(null)
    const camera = useThree((state)=> state.camera)

    const updateCameraTarget = (moveX:number, moveZ:number) => {
        //move camera
        camera.position.x += moveX
        camera.position.z += moveZ

        //update camera target
        cameraTarget.x = model.scene.position.x
        cameraTarget.y = model.scene.position.y + 2
        cameraTarget.z = model.scene.position.z
        if(controlRef.current) controlRef.current.target = cameraTarget
    }


    useEffect(()=>{
        let action = ""
        
        if(forward || backward || left || right) {
            action = "walking";
            if(shift) {
                action = "running"
            }
        } else if (jump) {
            action = "jump"
        } else {
            action = "idle"
        }

        if(currentAction.current !=action) {
            const nextActionToPlay = actions[action]
            const current = actions[currentAction.current]
            current?.fadeOut(0.2);
            nextActionToPlay?.reset().fadeIn(0.2).play();
            currentAction.current = action
        }
    },[forward,backward,jump,left,right,shift])

    useFrame((state, delta)=> {
        if(currentAction.current == "walking" || currentAction.current == "running" ) {
            // calculate towards camera direction
            let angleYCameraDirection = Math.atan2(
                camera.position.x - model.scene.position.x,
                camera.position.z - model.scene.position.z
            )

            // diagonal movements angle offset
            let newDirectionOffset = directionOffset({forward,backward,left,right})

            // rotate model
            rotateQuaternion.setFromAxisAngle(
                rotateAngle,
                angleYCameraDirection + newDirectionOffset
            )
            model.scene.quaternion.rotateTowards(rotateQuaternion, 0.2)

            // calculate direction 
            camera.getWorldDirection(walkDirection)
            walkDirection.y = 0
            walkDirection.normalize()
            walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset)

            // run/walk velocity
            const velocity = currentAction.current == 'running' ? 10 : 5

            // move model & camera 
            const moveX = walkDirection.x * velocity * delta
            const moveZ = walkDirection.z * velocity * delta
            model.scene.position.x += moveX
            model.scene.position.z += moveZ
            updateCameraTarget(moveX, moveZ)
        }
    })

    return (
        <>
        <OrbitControls ref={controlRef} />
        <primitive  object={model.scene} />
        </>
    )
}

export default Player