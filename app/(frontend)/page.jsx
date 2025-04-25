import React from 'react'

const page = () => {
    return (
        <>
            <div>Main</div>
            <div
            // class="softphone"
            >
                <iframe id="softphone" allow="camera *; microphone *; geolocation *"
                    src="https://apps.mypurecloud.jp/crm/index.html?crm=framework-local-secure"
                    className='w-full h-screen'></iframe>
            </div>
        </>
    )
}

export default page