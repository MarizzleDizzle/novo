import { useEffect } from 'react';
import { Modal } from 'bootstrap';

interface ImpressumModalProps {
    show: boolean;
    onHide: () => void;
}

export default function ImpressumModal({ show, onHide }: ImpressumModalProps) {
    useEffect(() => {
        // Bootstrap modal implementation
        const modalElement = document.getElementById('impressumModal');
        if (!modalElement) return;

        const modalInstance = new Modal(modalElement);

        if (show) {
            modalInstance.show();
        } else {
            modalInstance.hide();
        }

        // Event listener for when the modal is hidden
        modalElement.addEventListener('hidden.bs.modal', onHide);

        return () => {
            modalElement.removeEventListener('hidden.bs.modal', onHide);
        };
    }, [show, onHide]);

    return (
        <div className="modal fade" id="impressumModal" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Impressum</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Angaben gemäß § 5 TMG</p>
                        <p>
                            <strong>Movo – Move and Go</strong><br />
                            Dein Vor- und Nachname (oder Firmenname)<br />
                            Straße Hausnummer<br />
                            PLZ Ort<br />
                            Deutschland
                        </p>
                        {/* Rest of the impressum content */}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Schließen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}