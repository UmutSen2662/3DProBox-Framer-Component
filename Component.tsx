import { addPropertyControls, ControlType, useIsOnFramerCanvas } from "framer"

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerDisableUnlink
 */

export default function ProBox_3D(props) {
    const {
        embed,
        customize: {
            autoload,
            buttonload,
            info_buttons,
            bg_toggle,
            background_clr,
            background_img,
            radius,
        },
    } = props

    if (embed == "") {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    fontSize: 18,
                    background: "white",
                }}
            >
                Please select a model to display
            </div>
        )
    }

    let src_begin = embed.indexOf('src="') + 5
    let src_end = embed.indexOf("?")
    if (src_end === -1) {
        src_end = embed.indexOf('" title="')
    }
    let raw_source = embed.slice(src_begin, src_end)

    const source =
        raw_source +
        `?autoload=${autoload}&buttonload=${buttonload}&info_buttons=${info_buttons}`

    const frameStyle = {
        width: "100%",
        height: "100%",
        display: "inline-block",
        position: "relative",
        overflow: "hidden",
        backgroundColor: bg_toggle ? background_clr : "transparent",
        borderRadius: radius,
    }

    console.log(background_img)
    return (
        <div style={frameStyle}>
            {!bg_toggle ? (
                <img
                    src={background_img?.src}
                    srcSet={background_img?.srcSet}
                    alt={background_img?.alt}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        position: "absolute",
                        objectPosition: `${background_img?.positionX} ${background_img?.positionY}`,
                    }}
                />
            ) : (
                ""
            )}
            <iframe
                src={source}
                title="3D ProBox Model Viewer"
                style={{ width: "100%", height: "100%", position: "absolute" }}
                frameborder="0"
                allow="web-share; xr-spatial-tracking"
                loading="lazy"
                scrolling="no"
                referrerpolicy="origin-when-cross-origin"
                allowfullscreen="allowfullscreen"
            ></iframe>
        </div>
    )
}

ProBox_3D.defaultProps = {
    toggle: true,
    customize: {
        autoload: true,
        buttonload: false,
        info_buttons: true,
        bg_toggle: true,
        background_clr: "transparent",
        radius: 0,
    },
}

addPropertyControls(ProBox_3D, {
    toggle: {
        type: ControlType.Boolean,
        title: "Toggle",
        enabledTitle: "Embed",
        disabledTitle: "User",
    },
    user: {
        type: ControlType.String,
        title: "User",
        placeholder: "Log in to 3DProBox",
        hidden(props) {
            return props.toggle
        },
    },
    models: {
        type: ControlType.String,
        title: "Search",
        placeholder: "Model name",
        hidden(props) {
            return props.toggle
        },
    },
    embed: {
        type: ControlType.String,
        title: "Code",
        hidden(props) {
            return !props.toggle
        },
    },
    customize: {
        type: ControlType.Object,
        title: "Customize",
        icon: "effect",
        controls: {
            autoload: { type: ControlType.Boolean, title: "Autoload" },
            buttonload: { type: ControlType.Boolean, title: "Buttonload" },
            info_buttons: { type: ControlType.Boolean, title: "Info Buttons" },
            bg_toggle: {
                type: ControlType.Boolean,
                title: "Type",
                enabledTitle: "Color",
                disabledTitle: "Image",
            },
            background_clr: {
                type: ControlType.Color,
                title: "Background",
                hidden(props) {
                    return !props.bg_toggle
                },
            },
            background_img: {
                type: ControlType.ResponsiveImage,
                title: "Background",
                hidden(props) {
                    return props.bg_toggle
                },
            },
            radius: { type: ControlType.BorderRadius, title: "Radius" },
        },
    },
})
