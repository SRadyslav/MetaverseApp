

const Ground: React.FC = () => {

    return (
    <mesh receiveShadow rotation-x={Math.PI * -0.5} >
        <planeBufferGeometry args={[100, 100]} />
        <meshStandardMaterial color={"#458745"} />
    </mesh>
    )
}

export default Ground